import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { ApiCoreService, CORE_APP_STARTED } from '@pubkey-network/api-core-data-access'
import { PrismaSessionStore } from '@quixo3/prisma-session-store'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import { exec } from 'node:child_process'
import { AppModule } from './app/app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const core = app.get(ApiCoreService)
  app.setGlobalPrefix(core.config.prefix)
  app.use(cookieParser())
  app.use(
    session({
      secret: core.config.sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: { secure: !core.config.isDevelopment },
      store: new PrismaSessionStore(core.data, {
        checkPeriod: 2 * 60 * 1000, //ms
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }),
    }),
  )
  const host = `http://${core.config.host}:${core.config.port}`
  await app.listen(core.config.port, core.config.host)
  Logger.log(`🚀 RestAPI is running on: ${host}${core.config.prefix}.`)
  Logger.log(`🚀 GraphQL is running on: ${host}/graphql.`)
  Logger.log(`🔋 API_URL: ${core.config.apiUrl}`)
  Logger.log(`🔋 WEB_URL: ${core.config.webUrl}`)
  Logger.log(`🔋 COOKIE_DOMAINS: ${core.config.cookieDomains.join(', ')}`)
  if (core.config.isDevelopment) {
    Logger.warn(`🐞 Application is running in development mode.`)
    exec('prettier --write ./api-schema.graphql ./api-swagger.json', { cwd: process.cwd() })
  }
  core.eventEmitter.emit(CORE_APP_STARTED)
}

bootstrap()
