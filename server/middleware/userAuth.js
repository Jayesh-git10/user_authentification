import jwt from "jsonwebtoken";

const userAuth = async (req,res,next) => {
    const {token}=req.cookies;

    if(!token){
        return res.json({success:false , message :"User login Authentification failed again"});
    }

    try {
        const tokenDecode = jwt.verify(token,process.env.JWT_SECRET);
        if(tokenDecode.id){
            req.body = req.body || {}; // ✅ Ensure it's not undefined
            req.body.userId = tokenDecode.id;

        }else{
            return res.json({success:true , message:"Not Authorised login again"});
        }

        next();
    } catch (error) {
        return res.json({success : false,message:error.message});
    }
}

export default userAuth;