/**
 * Define Index Routes Here
 */

const router = Router()
router.get("/", (req, res) => {
    res.render("home", {
        name: env["APP_ID"]
    })
})

router.post("/json", (req, res) => {
    res.json(req.body)
})
export default router
