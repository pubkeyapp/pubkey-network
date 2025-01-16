import { Injectable } from '@nestjs/common'
import { ApiCoreService } from '@pubkey-network/api-core-data-access'

@Injectable()
export class ApiOnboardingService {
  constructor(private readonly core: ApiCoreService) {}
}
