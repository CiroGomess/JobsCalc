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
            //req para pegar os dados 
            const data = req.body
            // definir quantos  semanas tem no ano
            const weekPerYear = 52
            // remover as semanas de ferias do ano, pegar quantas  semanas tem em 1 mês 
            const weekPerMonth = (weekPerYear - data["vacation-per-year"]) / 12
            // quantas  horas por semana estou trabalhando 
            const weekTotalHours = data["hours-per-day"] * data["days-per-week"]
            // total de horas trabalhadas no mes 
            const monthlyTotalHours = weekTotalHours * weekPerMonth
            // qual será o valor da minha hora 
            const valuerHours = (data["value-hour"] = data["monthly-budget"] / monthlyTotalHours).toFixed(2).replace(".", ",")

            console.log(`Valor da hora: R$${valuerHours}`);

            Profile.data = {
                ...Profile.data,
                ...req.body,
                'value-hour': valuerHours
            }

            return res.redirect('/profile')


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
                    budget: Job.services.calculateBudget(job, Profile.data['value-hour'])
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
        },
        show(req, res) {

            //Pegando ID
            const jobId = req.params.id
            const job = Job.data.find(job => Number(job.id) === Number(jobId))

            if (!job) {
                return res.send('Job not found!')
            }

            job.budget = Job.services.calculateBudget(job, Profile.data['value-hour'])


            return res.render(`${views}/job`)
        },
        update(req, res) {
            // Verificando se existe o ID para fazer a atualização dos dados
            const jobId = req.params.id
            const job = Job.data.find(job => Number(job.id) === Number(jobId))

            if (!job) {
                return res.send('Job not found!')
            }


            const updateJob = {
                // Pegando dados que já existe
                ...job,
                // Pegando dadps da requisição e alterando 
                name: req.body.name,
                'toral-hours': req.body['total-hours'],
                'daily-hours': req.body['daily-hours'],

            }

            Job.data = Job.data.map(job => {

                if (Number(job.id) === Number(job.id)) {
                    job = updateJob
                }

                return job
            })


            res.redirect('/job/' + jobId)

        },
        delete(req, res){
            const jobId = req.params.id
            
            Job.data = Job.data.filter(job => Number(job.id) !== Number(job.id))


            return res.redits('/')
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
        },
        calculateBudget: (job, valueHour) => valueHour * job['total-hours']

    }
}



// Rotas 
routes.get('/', Job.controllers.index)
routes.get('/job', Job.controllers.create)
routes.post('/job', Job.controllers.save)
routes.get('/job/:id', Job.controllers.show) // Pegando ID
routes.post('/job/:id', Job.controllers.update) // Update
routes.post('/job/delete/:id', Job.controllers.update) // Delete
routes.get('/profile', Profile.controllers.index)
routes.post('/profile', Profile.controllers.update)


// compartilhando as rotas com outros arquivos
module.exports = routes;