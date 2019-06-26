import cdk = require('@aws-cdk/core');
import codebuild = require('@aws-cdk/aws-codebuild');
import codepipeline = require('@aws-cdk/aws-codepipeline');
import codepipeline_actions = require('@aws-cdk/aws-codepipeline-actions');

export class CodePipelineStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const sourceOutput = new codepipeline.Artifact();
    const sourceAction = new codepipeline_actions.GitHubSourceAction({
      actionName: 'GitHub',
      owner: 'samdengler',
      repo: 'cdk-widget-demo',
      oauthToken: cdk.SecretValue.secretsManager('my-github-token'),
      output: sourceOutput,
      trigger: codepipeline_actions.GitHubTrigger.POLL
    });

    const project = new codebuild.PipelineProject(this, 'CdkBuildProject', {
      environment: {
        buildImage: codebuild.LinuxBuildImage.UBUNTU_14_04_NODEJS_8_11_0
      },
      buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          install: {
            commands: [
              'npm install',
            ]
          },
          build: {
            commands: [
              'npm run build',
              'npm run cdk synth MyWidgetServiceStack -- -o build',
            ]
          }
        },
        artifacts: {
          'base-directory': 'build',
          files: 'MyWidgetServiceStack.template.json',
        }
      })
    });

    const buildOutput = new codepipeline.Artifact();
    const buildAction = new codepipeline_actions.CodeBuildAction({
      actionName: 'CodeBuild',
      project,
      input: sourceOutput,
      outputs: [buildOutput]
    });

    const deployAction = new codepipeline_actions.CloudFormationCreateUpdateStackAction({
      actionName: 'CFN_Deploy',
      stackName: 'DevMyWidgetServiceStack',
      templatePath: buildOutput.atPath('MyWidgetServiceStack.template.json'),
      adminPermissions: true
    });

    new codepipeline.Pipeline(this, 'MyPipeline', {
      stages: [
        {
          stageName: 'Source',
          actions: [ sourceAction ]
        },
        {
          stageName: 'Build',
          actions: [ buildAction ]
        },
        {
          stageName: 'Deploy',
          actions: [ deployAction ]
        },
      ]
    });
  }
}