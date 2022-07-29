// const User = require("./../model/user")
// module.exports = async function(req, res, next){
//     let cookie = req.headers.cookie
//     if(!cookie) return res.status(401).json({msg: "something happened to header"});
//     cookie.split('; ').forEach(async token => {
//         if(token.trim().split('=')[0] === 'token' )
//         {
//             try {
//                 // console.log('yoken')
//                 let id = await User.findById(token.trim().split('=')[1])
//                 if(!id){
//                     res.status(400).json({error: [{msg: "user not found"}]});
//                 }
//                 req.user = token.trim().split('=')[1]
//                 next()
//             } catch (err) {
//                 console.error(err)
//                 res.status(401).json({msg: "something happened to header"});
//             }
//         }
//         else{
//             console.log('noooo cookcie')
//             return res.status(401).json({msg: 'not found token, check back again'})
//         }
//     })
// }

