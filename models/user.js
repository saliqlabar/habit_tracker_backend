const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const UserSchema=new mongoose.Schema(
    {
        name:
        {
            type:String,
            required:[true,'please provide your name'],
            minlength:3
        },
        weight:
        {
            type:Number,
            required:[true,'please provide your weight'],

        },
        age:
        {
            type:Number,
            required:[true,'please provide your age'],


        },
        sex:
        {
            type:String,
                     required:[true,'please provide your gender'],
   
        },
        height:
        {
            type:Number,
                        required:[true,'please provide your height'],

        },
        email:
        {
            type:String,
            required:[true,'please provide your email'],
            match: [
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                'Please provide a valid email',
                ],
            unique: true,
        },

        password:{
            type:String,
            required:[true,'please provide password'],
            minlength:6
        },
        activityLevel: {
    type: String,
    enum: ['sedentary', 'light', 'moderate', 'active', 'very_active'],
},



    }

)

UserSchema.pre('save', async function(){

const salt= await bcrypt.genSalt(10)
this.password=await bcrypt.hash(this.password,salt)

})

UserSchema.methods.CreateJWT=function (){
        return jwt.sign(
            {userId:this._id,name:this.name},
            process.env.JWT_SECRET,
            {
                expiresIn:'30d'
            }

        )

}
    
UserSchema.methods.ComparePassword=async function(pass){

    return await bcrypt.compare(pass,this.password)

}

UserSchema.methods.calculateMaintenanceCalories = function() {
    if (!this.weight || !this.height || !this.age || !this.sex) return null;

    let bmr;
    if (this.sex === 'male') {
        bmr = 10 * this.weight + 6.25 * this.height - 5 * this.age + 5;
    } else {
        bmr = 10 * this.weight + 6.25 * this.height - 5 * this.age - 161;
    }

    const multipliers = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        very_active: 1.9,
    };

    return Math.round(bmr * (multipliers[this.activityLevel] || 1.2));
};






module.exports=mongoose.model('User',UserSchema)