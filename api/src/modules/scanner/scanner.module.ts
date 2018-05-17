import { Module } from '@nestjs/common';
import { ScannerService } from './scanner.service';

@Module({
    components: [ScannerService],
    exports: [ScannerService]
})
export class ScannerModule {}
