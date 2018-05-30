import { Module } from '@nestjs/common';
import {ScannerModule} from "./modules/scanner.module";


@Module({
    modules: [ScannerModule],
})
export class ApplicationModule { }