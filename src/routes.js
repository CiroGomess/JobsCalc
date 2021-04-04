const express = require('express')
const routes = express.Router()

const views = __dirname + '/views'

const Profile = {
    data: {
        name: 'Ciro Gomes',
        avatar: 'https://avatars.githubusercontent.com/u/43193194?v=4',
        "monthly-budget": 3000,
        "days-per-week": 5,
        "hours-per-day": 5,
        "vacation-per-year": 4,
        "value-hour": 75
    },
    controllers: {
        index(req, res) {
            return res.render(`${views}/profile`, { profile: Profile.data })
        },
        update(req, res) {

        }
    }
}


const Job = {
    data: [
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
    ],

    controllers: {
        index(req, res) {

            const updateJobs = Job.data.map((job) => {

                const remaining = Job.services.remainingDays(job)
                const status = remaining <= 0 ? 'done' : 'progress'

                return {
                    ...job,
                    remaining,
                    status,
                    budget: Profile.data['value-hour'] * job['total-hours']
                }

            })


            return res.render(`${views}/index`, { jobs: updateJobs })

        },
        save(req, res) {
            const jobId = Job.data[Job.data.length - 1]?.id || 1;

            Job.data.push({
                id: jobId + 1,
                name: req.body.name,
                'daily-hours': req.body["daily-hours"],
                'total-hours': req.body['total-hours'],
                create_at: Date.now() // atribuindo data de hoje

            })
            return res.redirect('/') //Redirecionando para page inicial 
        },
        create(req, res) {
            return res.render(`${views}/job`)
        }

    },
    services: {
        remainingDays(job) {
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

    }
}

const JobEdit = {
    controllers: {
        updateJob(req, res) {
            return res.render(`${views}/job`)
        }
    }
}

// Rotas 
routes.get('/', Job.controllers.index)
routes.get('/job', Job.controllers.create)
routes.post('/job', Job.controllers.save)
routes.get('/job/edit', JobEdit.controllers.updateJob)
routes.get('/profile', Profile.controllers.index)


// compartilhando as rotas com outros arquivos
module.exports = routes;