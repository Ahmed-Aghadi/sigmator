export default async function handler(req, res) {
    console.log(process.env.NEXT_PUBLIC_API_URL)
    res.status(200).json({ id: "nice" })
}
