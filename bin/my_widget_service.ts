#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { MyWidgetServiceStack } from '../lib/my_widget_service-stack';
import { CodePipelineStack } from '../lib/code-pipeline-stack';

const app = new cdk.App();
const myWidgetServiceStack = new MyWidgetServiceStack(app, 'MyWidgetServiceStack');
new CodePipelineStack(app, 'CodePipelineStack', {
  lambdaCode: myWidgetServiceStack.widgetService.lambdaCode
});
