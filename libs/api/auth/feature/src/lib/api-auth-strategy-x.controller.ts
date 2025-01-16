import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common'

import {
  ApiAnonJwtGuard,
  ApiAuthRequest,
  ApiAuthService,
  ApiAuthStrategyXGuard,
} from '@pubkey-network/api-auth-data-access'
import { Response } from 'express-serve-static-core'

@Controller('auth/x')
export class ApiAuthStrategyXController {
  constructor(private readonly service: ApiAuthService) {}

  @Get()
  @UseGuards(ApiAuthStrategyXGuard)
  redirect() {
    // This method triggers the OAuth2 flow
  }

  @Get('callback')
  @UseGuards(ApiAnonJwtGuard, ApiAuthStrategyXGuard)
  async callback(@Req() req: ApiAuthRequest, @Res({ passthrough: true }) res: Response) {
    return this.service.userCookieRedirect(req, res)
  }
}
