

var User =require('../models/user'); 
var jwt = require('jsonwebtoken');
var secret="harrypotter";

module.exports = function(router){

    /*http://localhost:8080/api/users*/
    //USER REGISTRATION ROUTE
            router.post('/users',function(req,res){
            //res.send('testing users route');
            var user=new User();
            user.username=req.body.username;
            user.password=req.body.password;
            user.email=req.body.email;
            console.log('user' + user);
            
            if(req.body.username == null || req.body.username == '' || req.body.password == null || req.body.password == '' || req.body.email == null || req.body.email == '')
            { 
               res.json({success:false, message:'Ensure username,email and password were provided'});
             }
            else{
                user.save(function(err){
                    console.log(user);
                if(err){
                   // res.send('Username or Email already exists!');
                res.json({success:false,message:'Username or Email already exists!'});
                }
                else{
                    //res.send('user created!');
                    res.json({success:true,message:'user created!'});
                }
            });
            } 
        });

        //USER LOGIN ROUTE
        //http://localhost:port/api/authenticate
        router.post('/authenticate',function(req,res){
            //res.send('testing new route');
            User.findOne({username:req.body.username}).select('email username password').exec(function(err,user){
                if(err) throw err;
                if(!user){
                    res.json({success:false,message:'Could not authenticate user'});

                }
                else if(user){
                    if(req.body.password){
                        var validPassword=user.comparePassword(req.body.password);
                    }
                    else{
                        res.json({success:false,message:'No password provided'});
                    }
                    if(!validPassword){
                        res.json({success:false,message:'Could not authenticate password'});
                    }
                    else{
                       var token= jwt.sign({username:user.username,email:user.email},secret,{expiresIn:'24h'});
                        res.json({success:true,message:'User authenticated!',token:token});
                    }
                }
            });
        });

        router.use(function(req,res,next){
            var token=req.body.token || req.body.query || req.headers['x-access-token'];
            if(token){
                jwt.verify(token,secret,function(err,decoded){
                    if(err){
                        res.json({success:false,message:"Token invalid"});
                    }
                    else{
                        req.decoded=decoded;
                        next();
                    }
                });
            }
            else{
                res.json({success:false,message:"No token provided"});
            }
        });

        router.post('/me', function(req,res){
            res.send(req.decoded);
        });

        router.get('/permission',function(req,res){ //8
            User.findOne({username:req.decoded.username},function(err,user){
                if(err) throw err;
                //console.log(user);
                if(!user){
                    res.json({success:false,message:'No user was found'});
                }
                else{
                   // console.log(user.permission);
                    res.json({success:true,permission:user.permission});
                }
            });
        });

        router.get('/management',function(req,res){ //15
            User.find({},function(err,users){
                //console.log('dat1');
                if(err) throw err;
                User.findOne({username:req.decoded.username},function(err,mainUser){
                    //console.log('dat2');
                    if(err) throw err;
                    if(!mainUser){
                        
                        res.json({success:false, message: 'No user found'});
                    }
                    else{
                        if(mainUser.permission==='admin' || mainUser.permission === 'moderator'){
                            if(!users){
                                res.json({success:false,message:'User not found'});
                            }
                            else{
                                console.log(mainUser.permission);
                                res.json({success:true,users:users, permissions:mainUser.permission});

                            }
                        }
                        else{
                            res.json({success:false,message:'Insufficient Permission'});
                        }
                    }
                });

            });
        });

        router.delete('/management/:username', function(req,res){ //27
            var deletedUser=req.params.username;
            User.findOne({username:req.decoded.username},function(err,mainUser){
                if(err) throw err;
                if(!mainUser){
                    res.json({success:false,message:'No user found'});
                }else{
                    if(mainUser.permission !=='admin'){
                        rs.json({succes:false, message:'Insufficient Permissions'});
                    }else{
                        User.findOneAndRemove({username:deletedUser}, function(err,user){
                            if(err) throw err;
                            res.json({success:true});
                        });
                    }
                }
            });
        });

        router.get('/edit/:id',function(req,res){ //37
            var editUser=req.params.id;
            console.log(editUser + 'userid');
            User.findOne({username:req.decoded.username},function(err,mainUser){
                if(err) throw err;
                if(!mainUser){
                    res.json({success:false,message:'No user found'});
                }
                else{
                    if(mainUser.permission === 'admin' || mainUser.permission=== 'moderator'){
                        User.findOne({_id:editUser}, function(err,user){
                            if(err) throw err;
                            if(!user){
                                res.json({success:false,message:'No user found'});
                            }
                            else{
                                console.log(user);
                                res.json({success:true,user:user});
                            }
                        });
                    }
                    else{
                        res.json({success:false,message: 'Insufficient Permissions'});
                    }
                }
            });
        });


        router.put('/edit', function(req,res){ //40
            var editUser=req.body._id;
console.log(editUser + 'put');
            if(req.body.name) var newName=req.body.name;
            if(req.body.username) var newUsername=req.body.username;
            if(req.body.email){ var newEmail=req.body.email;console.log(newEmail);}
            if(req.body.permission) var newPermission=req.body.permission;
            User.findOne({username:req.decoded.username}, function(err,mainUser){
                if(err) throw err;
                if(!mainUser){
                    res.json({success:false,message:"no user found"});
                } else{
                   
                    if(newName){
                        if(mainUser.permission === 'admin' || mainUser.permission==='moderator'){
                            User.findOne({_id:editUser}, function(err,user){
                                if(err) throw err;
                                if(!user){
                                    res.json({success:false,message:'No user found'});
                                }else{
                                    user.name=newName;
                                    user.save(function(err){
                                        if(err){
                                            console.log(err);
                                        }
                                        else{
                                            res.json({success:true, message:'Name has been updated'});
                                        }
                                    });
                                }
                            });
                        }else{
                            res.json({success:false, message:'Insufficient Permissions'});              
                        }
                    }

                    if(newUsername){
                        if(mainUser.permission === 'admin' || mainUser.permission==='moderator'){
                            User.findOne({_id:editUser}, function(err,user){
                                if(err) throw err;
                                if(!user){
                                    res.json({success:false,message:'No user found'});
                                }else{
                                    user.username=newUsername;
                                    user.save(function(err){
                                        if(err){
                                            console.log(err);
                                        }
                                        else{
                                            res.json({success:true, message:'Username has been updated'});
                                        }
                                    });
                                }
                            });
                        }else{
                            res.json({success:false, message:'Insufficient Permissions'});              
                        }
                    }

                    if(newEmail){
                        if(mainUser.permission === 'admin' || mainUser.permission==='moderator'){
                            User.findOne({_id:editUser}, function(err,user){
                                if(err) throw err;
                                if(!user){
                                    res.json({success:false,message:'No user found'});
                                }else{
                                    user.email=newEmail;
                                    user.save(function(err){
                                        if(err){
                                            console.log(err);
                                        }
                                        else{
                                            res.json({success:true, message:'Email has been updated'});
                                        }
                                    });
                                }
                            });
                        }else{
                            res.json({success:false, message:'Insufficient Permissions'});              
                        }
                    }

                    if(newPermission){
                        if(mainUser.permission === 'admin' || mainUser.permission=== 'moderator'){
                            User.findOne({_id:editUser}, function(err,user){
                                if(err) 
                                    throw err;
                                if(!user){
                                    res.json({success:false,message:'No user found'});
                                }else{


                                    if(newPermission==='user'){
                                        if(user.permission=== 'admin'){
                                            if(mainUser.permission!=='admin'){ //only an admin has the right to change from admin to user
                                                res.json({success:false,message:'Insufficient Permissions.You must be an admin to downgrade another admin'});
                                            }else{ //if it an admin then save it
                                                user.permission=newPermission;
                                                user.save(function(err){
                                                    if(err){
                                                        console.log(err);
                                                    }else{
                                                        res.json({success:true,message:'Permissions have been updated'});
                                                    }
                                                });
                                            }
                                        }else{ //admin or moderator can change a moderator to user or user to user
                                            user.permission=newPermission;
                                                user.save(function(err){
                                                    if(err){
                                                        console.log(err);
                                                    }else{
                                                        res.json({success:true,message:'Permissions have been updated'});
                                                    }
                                                });
                                        }
                                    }


                                    if(newPermission==='moderator'){
                                        if(user.permission=== 'admin'){
                                            if(mainUser.permission!=='admin'){ //only an admin has the right to change from admin to moderator
                                                res.json({success:false,message:'Insufficient Permissions.You must be an admin to downgrade another admin'});
                                            }else{ //if it an admin then save it
                                                user.permission=newPermission;
                                                user.save(function(err){
                                                    if(err){
                                                        console.log(err);
                                                    }else{
                                                        res.json({success:true,message:'Permissions have been updated'});
                                                    }
                                                });

                                            }
                                        }else{ //admin or moderator can change a moderator to moderator  or user to moderator
                                            user.permission=newPermission;
                                            user.save(function(err){
                                                if(err){
                                                    console.log(err);
                                                }else{
                                                    res.json({success:true,message:'Permissions have been updated'});
                                                }
                                            });
                                        }
                                     }


                                     if(newPermission==='admin'){
                                         if(mainUser.permission==='admin'){
                                             user.permission=newPermission;
                                             user.save(function(err){
                                                 if(err){
                                                     console.log(err);
                                                 }else{
                                                     res.json({success:true,message:'Permissions hav been updated!'});
                                                 }
                                             });
                                         }else{
                                             res.json({success:false,message:'Insufficient Permissions'});
                                         }
                                     }

                                     
                                }
                            });
                        } else{
                            res.json({success:false,message:'Insufficient Permissions'});
                        }
                    }
                }

            });
        });

        return router;
};

















