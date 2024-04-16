import { Module } from '@nestjs/common'
import { ApiCoreFeatureModule } from '@pubkey-network/api-core-feature'

@Module({
  imports: [ApiCoreFeatureModule],
})
export class AppModule {}
