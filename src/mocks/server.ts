import { createServer, Model, Factory } from 'miragejs'
import { faker } from '@faker-js/faker'

export function makeServer({ environment = 'development' } = {}) {
  return createServer({
    environment,

    models: {
      user: Model,
      dashboard: Model
    },

    factories: {
      user: Factory.extend({
        id() { return faker.string.uuid() },
        name() { return faker.person.fullName() },
        email() { return faker.internet.email() },
        role() { 
          const roles = ['ADMIN', 'USER', 'MANAGER']
          return roles[Math.floor(Math.random() * roles.length)]
        },
        createdAt() { return faker.date.past().toISOString() }
      }),
      dashboardStat: Factory.extend({
        totalUsers() { return faker.number.int({ min: 100, max: 1000 }) },
        totalRevenue() { return faker.number.int({ min: 1000, max: 10000 }) },
        activeProjects() { return faker.number.int({ min: 10, max: 100 }) }
      })
    },

    seeds(server) {
      // Create 50 mock users
      server.createList('user', 50)
      
      // Create dashboard stats
      server.create('dashboardStat')
    },

    routes() {
      this.namespace = 'api'

      // Authentication Routes
      this.post('/auth/login', (schema:any, request) => {
        const { email, password } = JSON.parse(request.requestBody)
        
        // Simple mock login
        if (email && password) {
          return {
            token: faker.string.uuid(),
            user: {
              id: faker.string.uuid(),
              name: faker.person.fullName(),
              email: email,
              role: 'ADMIN'
            }
          }
        }
        
        return { error: 'Invalid credentials' }
      })

     // User Management Routes
      this.get('/users', (schema: any, request) => {
        let users = schema.users.all()
        /*const { page = 0, pageSize = 10, search, sortField, sortOrder } = request.queryParams
        

        // Filtering
        if (search) {
          users.models = users.models.filter((user: any) => 
            user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase())
          )
        }

        // Sorting
        if (sortField && sortOrder) {
          users.models.sort((a: any, b: any) => {
            const valueA = a[sortField]
            const valueB = b[sortField]
            return sortOrder === 'asc' 
              ? valueA.localeCompare(valueB) 
              : valueB.localeCompare(valueA)
          })
        }

        // Pagination
        const startIndex = page * pageSize
        const endIndex = startIndex + pageSize
        const paginatedUsers = users.models.slice(startIndex, endIndex)

        return {
          users: paginatedUsers,
          total: users.models.length
        }*/
        return {
          users: users.models,
          total: users.models.length
        }
      })
    
       // Create User
       this.post('/users', (schema: any, request) => {
        const attrs = JSON.parse(request.requestBody)
        return schema.users.create({
          ...attrs,
          id: faker.string.uuid(),
          createdAt: new Date().toISOString()
        })
      })
      // Update User
      this.put('/users/:id', (schema: any, request) => {
        const id = request.params.id
        const attrs = JSON.parse(request.requestBody)
        const user = schema.users.find(id)
        return user.update(attrs)
      })

      // Delete User
      this.delete('/users/:id', (schema: any, request) => {
        const id = request.params.id
        const user = schema.users.find(id)
        user.destroy()
        return { success: true }
      }) 
      
      // Dashboard Routes
      this.get('/dashboard/stats', (schema:any, request) => {
        debugger;   
        let stats=  {
            totalUsers: 10,
            totalRevenue: 15,
            activeProjects: 5
        }
        return stats
      })
    }
  })
}