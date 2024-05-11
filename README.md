# CDK Deployment with TypeScript

This project demonstrates a CDK deployment using TypeScript, including the configuration of various AWS services such as EC2, DynamoDB, and API Gateway. It also includes a React application for file upload to S3 and storing data in a DynamoDB table.

## Prerequisites

Before running the code, make sure you have the following:

- AWS CLI configured with the necessary credentials
- Node.js and npm installed

## Demo Video 

https://drive.google.com/drive/folders/1aiqWRlS_AD3todJRLiXlbiz7yG0Q_nR0?usp=drive_link

## Project Structure

The project structure is as follows:

- `src/constructs`: Contains all the basic constructs including the `ScriptLambda` function and `UploadLambdaFunction`.
- `src/lambda/script/index.js`: Contains the script Lambda function to trigger the event from DynamoDB.
- `src/lambda/upload/index.js`: Contains the upload Lambda function to upload the form data to S3 and DynamoDB.
- `src/react-app`: Contains the React application where the form is developed.
- `src/scripts`: Contains the script file to run the trigger.

## Running the CDK Deployment

To run the CDK deployment, follow these steps:

1. Navigate to the `FovusLikithRamanavanithanStack` directory:
cd FovusLikithRamanavanithanStack

2. Install the dependencies:
npm install

3. Build the project:
npm run build

4. Deploy the CDK stack:
cdk deploy

Alternatively, you can use `cdk watch` for continuous deployment.

## Running the React Application

To run the React application, follow these steps:

1. Navigate to the `src/react-app` directory:
cd src/react-app

2. Install the dependencies:
npm install

3. Start the development server:
npm start

The React application will be accessible at `http://localhost:3000`.

## Testing the application :

1. Add your Api Endpoint once after deployment to the react form post
2. Upload the scr/scripts/script.sh file to the s3 bucket

## Additional Resources

My resources include :

https://docs.aws.amazon.com/cdk/v2/guide/apps.html
https://docs.aws.amazon.com/cdk/v2/guide/tools.html
https://docs.aws.amazon.com/cdk/api/v1/docs/aws-lambda-readme.html
https://docs.aws.amazon.com/cdk/v2/guide/home.html

https://docs.aws.amazon.com/cdk/api/v1/docs/aws-lambda-event-sources-readme.html#dynamodb-stream

https://docs.aws.amazon.com/cdk/v2/guide/permissions.html

https://stackoverflow.com/

---

Feel free to customize the README file further based on your specific project requirements and add any additional sections or information as needed.
This README file provides an overview of your CDK deployment with TypeScript, including the project structure, instructions for running the CDK deployment, and instructions for running the React application. It also includes links to relevant documentation for further reference.
