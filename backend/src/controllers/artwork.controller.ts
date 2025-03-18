import { Request, Response} from 'express'

//home
const home = (req: Request, res: Response) => {
    res.status(200).send("Welcome to my server!")
}

//getCookie
const setCookie = (req: Request, res: Response) => {
    if(req.session){
        req.session.message = "Here's your cookie"
    }
    res.status(200).json({
        message: "You got a cookie!"
    })
}

//checkCookie
const checkCookie = (req: Request, res: Response) => {
    if(req.session && req.session.message){
        res.status(200).json({
            content: req.session.message
        })
        return
    }
    res.status(500).json({
        content: "No cookie found. Keep trying!"
    })
}

const clearCookie = (req: Request, res: Response) => {
    req.session = null
    res.status(200).json({
        content: "Session cookie cleared!"
    })
}

export default {
    home,
    setCookie,
    checkCookie,
    clearCookie
}