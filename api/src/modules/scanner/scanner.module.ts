import { Module } from '@nestjs/common';
import { ScannerService } from './scanner.service';

@Module({
    components: [ScannerService]
})
export class ScannerModule {}
