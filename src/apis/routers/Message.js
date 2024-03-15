const router = require('express').Router()

router.post("/send/:id",async (req,res)=>{
     console.log('msg sent');
})

module.exports = router