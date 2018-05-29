import { Module } from '@nestjs/common';
import { ScannerService } from './scanner.service';
import { ApiClient } from "./scanner.api.client";

@Module({
    components: [ScannerService, ApiClient],
    exports: [ScannerService]
})
export class ScannerModule {}
