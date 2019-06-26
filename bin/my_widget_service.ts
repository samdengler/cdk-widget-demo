#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { MyWidgetServiceStack } from '../lib/my_widget_service-stack';

const app = new cdk.App();
new MyWidgetServiceStack(app, 'MyWidgetServiceStack');
