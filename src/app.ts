import fastifyCors from '@fastify/cors'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import fastify from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { userContextRoutes } from './http/routes/userContext/index.ts'
import { userRoutes } from './http/routes/users/index.ts'

export const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.register(fastifyCors, {
  allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  origin: '*',
})

app.register(fastifySwagger, {
  openapi: {
    components: {
      securitySchemes: {
        bearerAuth: {
          bearerFormat: 'JWT',
          scheme: 'bearer',
          type: 'http',
        },
      },
    },
    info: {
      title: 'UAIFlow Server',
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

app.get(
  '/',
  () =>
    'Bem vindo ao UAIFlow Server! Acesse a página /docs para ver a documentação.'
)

app.register(userRoutes)
app.register(userContextRoutes)
