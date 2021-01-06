// User Auth 

router.post('/', function (req, res) {
    let token = req.cookies.token;
    authService.verifyParticipant(token).then(participant => {
        if (participant) {

        } else {
            return res.json({ message: "Please Login" })
        }
    })
})

// Admin Auth 
router.post('/', function (req, res) {
let token = req.cookies.token 
authService.verifyParticipant(token).then(participant => {
    if (participant) {
        if(participant.Admin) {

        }
    } else {
        return res.json ({ message: "Unauthorized Access" })
    }
})

}); 