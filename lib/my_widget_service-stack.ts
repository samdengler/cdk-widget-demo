import cdk = require('@aws-cdk/core');
import widget_service = require('../lib/widget_service');

export class MyWidgetServiceStack extends cdk.Stack {
  widgetService: widget_service.WidgetService;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.widgetService = new widget_service.WidgetService(this, 'Widgets');
  }
}
