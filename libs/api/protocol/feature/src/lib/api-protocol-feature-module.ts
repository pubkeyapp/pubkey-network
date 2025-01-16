import { Module } from '@nestjs/common'
import { ApiProtocolDataAccessModule } from '@pubkey-network/api-protocol-data-access'
import { ApiProtocolController } from './api-protocol-controller'
import { ApiProtocolResolver } from './api-protocol.resolver'

@Module({
  controllers: [ApiProtocolController],
  imports: [ApiProtocolDataAccessModule],
  providers: [ApiProtocolResolver],
})
export class ApiProtocolFeatureModule {}
