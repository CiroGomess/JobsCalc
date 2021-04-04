const express = require('express')
const routes = express.Router()

const views = __dirname + '/views'

const profile = {
    name: 'Ciro Gomes',
    avatar: 'https://avatars.githubusercontent.com/u/43193194?v=4',
    "monthly-budget": 3000,
    "days-per-week": 5,
    "hours-per-day": 5,
    "vacation-per-year": 4,
    "value-hour": 75
}


const jobs = [
    {
        id: 1,
        name: 'Pizzaria Guloso',
        'daily-hours': 2,
        'total-hours': 1,
        create_at: Date.now(),

    },
    {
        id: 2,
        name: 'One Two Project',
        'daily-hours': 3,
        'total-hours': 47,
        create_at: Date.now(),

    }
]


function remainingDays(job) {
    // ajustes no Jobs
    // Calculo de tempo restante
    const remainingDays = (job["total-hours"] / job["daily-hours"]).toFixed()
    // Pegando data de criação do JOB
    const createdDate = new Date(job.create_at)
    // Dia da entega do JOB
    const dueDay = createdDate.getDate() + Number(remainingDays)
    // Data do vencimento
    const dueDate = createdDate.setDate(dueDay)

    const timeDiffInMs = dueDate - Date.now()
    // transformando milli em dias 
    const dayInMs = 1000 * 60 * 60 * 24
    const dayDiff = Math.floor(timeDiffInMs / dayInMs)

    // restam x dias
    return dayDiff
}


routes.get('/', (req, res) => {

    const updateJobs = jobs.map((job) => {

        const remaining = remainingDays(job)
        const status = remaining <= 0 ? 'done' : 'progress'

        return {
            ...job,
            remaining,
            status,
            budget: profile['value-hour'] * job['total-hours']
        }

    })


    return res.render(`${views}/index`, { jobs: updateJobs })
})

// Rotas 


routes.get('/job', (req, res) => res.render(`${views}/job`))
routes.post('/job', (req, res) => {

    const jobId = jobs[jobs.length - 1]?.id || 1;

    jobs.push({
        id: jobId + 1,
        name: req.body.name,
        'daily-hours': req.body.daily_hours["daily-hours"],
        'total-hours': req.body['total-hours'],
        create_at: Date.now() // atribuindo data de hoje

    })
    return res.redirect('/') //Redirecionando para page inicial 
})


routes.get('/job/edit', (req, res) => res.render(`${views}/job`))

routes.get('/profile', (req, res) => res.render(`${views}/profile`, { profile: profile }))


// compartilhando as rotas com outros arquivos
module.exports = routes;