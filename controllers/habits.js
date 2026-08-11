const habits=require('../models/habits')
const { NotFound } = require('../errors')
const HabitCompletion = require('../models/habitCompletion') 
const { StatusCodes } = require('http-status-codes')
const habitCompletion = require('../models/habitCompletion')

const getallhabit = async (req, res) => {
  const { tags, date } = req.query
  const queryObject = { createdBy: req.user.userId }

  if (tags) {
    queryObject.tags = tags
  }

  const habit = await habits.find(queryObject).sort('createdAt')

  let targetDate;
  if (date) {
    const [year, month, day] = date.split('-').map(Number);
    targetDate = new Date(year, month - 1, day);
  } else {
    const now = new Date();
    targetDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (targetDate.getTime() > today.getTime()) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: "cannot view future dates" });
  }

  const currhabits = habit.filter(habit => {
    const createdDate = new Date(habit.createdAt.getFullYear(), habit.createdAt.getMonth(), habit.createdAt.getDate());
    return createdDate.getTime() <= targetDate.getTime();
  });

  const fullhabit = await Promise.all(
    currhabits.map(async (habit) => {
      const todayRecord = await HabitCompletion.findOne({ habit: habit._id, date: targetDate });
      const streak = await calculateStreak(habit._id);
      return {
        ...habit.toObject(),
        completedToday: todayRecord ? todayRecord.completed : false,
        streak,
      };
    })
  );

  res.status(StatusCodes.OK).json(fullhabit);
}

const getonehabit=async (req,res)=>{
const {
    user:{userId},
    params:{ id:habitid}
}=req


const habit=await habits.findOne({
    createdBy:userId,
    _id:habitid

})
  if(!habit)
    {
        throw new NotFound('habit not found')
    }

  const streak = await calculateStreak(habitid);

  const fullhabit = {
    ...habit.toObject(),
    streak,
  };

    res.status(StatusCodes.OK).json(fullhabit)




}



const createhabit=async (req,res)=>{
    req.body.createdBy=req.user.userId

    const habit=await habits.create(
        {... req.body}
    )

    if(!habit)
    {
        throw new NotFound('habit not found')
    }

    res.status(StatusCodes.OK).json(habit)
}


const updatehabit=async (req,res)=>{

    const {
    user:{userId},
    params:{ id:habitid}
     }=req

    const habit=await habits.findOneAndUpdate({createdBy:userId,_id:habitid},
        {... req.body},
        { new: true, runValidators: true }
    )


    if(!habit)
    {
        throw new NotFound('habit not found')
    }

    res.status(StatusCodes.OK).json(habit)
}


const deletehabit=async (req,res)=>{

    const {
    user:{userId},
    params:{ id:habitid}
     }=req

    const habit= await habits.findOneAndDelete({createdBy:userId,_id:habitid})


    if(!habit)
    {
        throw new NotFound('habit not found')
    }

    res.status(StatusCodes.OK).json(habit)
}


const markcomplete = async (req, res) => {
  const {
    user: { userId },
    params: { id: habitid },
    query: { date },
  } = req;

  const habit = await habits.findOne({ createdBy: userId, _id: habitid });
  if (!habit) throw new NotFound('habit not found');

  // build targetDate as local midnight, with no timezone parsing ambiguity
  let targetDate;
  if (date) {
    const [year, month, day] = date.split('-').map(Number);
    targetDate = new Date(year, month - 1, day); // month is 0-indexed in JS
  } else {
    const now = new Date();
    targetDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }

  // build today the same way, so both are normalized identically
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (targetDate.getTime() > today.getTime()) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'cannot mark future dates' });
  }

  let record = await HabitCompletion.findOne({ habit: habitid, date: targetDate });

  if (record) {
    record.completed = !record.completed;
    await record.save();
  } else {
    record = await HabitCompletion.create({
      habit: habitid,
      date: targetDate,
      completed: true,
    });
  }

  const streak = await calculateStreak(habitid);

  res.status(StatusCodes.OK).json({ date: targetDate, completed: record.completed ,streak});
}



async function calculateStreak(habitid) {
  let streak = 0;
  const now = new Date();
  let checkDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  while (true) {
    const record = await HabitCompletion.findOne({ habit: habitid, date: checkDate });

    if (record && record.completed) {
      streak++;
      checkDate = new Date(checkDate.getFullYear(), checkDate.getMonth(), checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

const getstreak = async (req, res) => {
  const {
    user: { userId },
    params: { id: habitid },
  } = req;

  const habit = await habits.findOne({ createdBy: userId, _id: habitid });
  if (!habit) throw new NotFound('habit not found');

  const streak = await calculateStreak(habitid);

  res.status(StatusCodes.OK).json({ streak });
}






module.exports={
    getallhabit,getonehabit,createhabit,updatehabit,markcomplete,deletehabit,getstreak
}