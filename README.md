# Arguflow AI

[`Arguflow AI`](https://arguflow.com) is your own personal debate coach. Powered by the ['SolidJS'](https://solidjs.com) framwork, Arguflow AI utilizes AI software to debate against users and provide feedback on how to improve argument skills.

## How to use Arguflow AI

Click "Start Debating Now" from the main menu and create an account.

Once registered, users can select topics, decide whether they are for or against said topic, and begin inputting arguments for their side of the debate. 

Arguflow will generate counterarguments as well as feedback on how arguments could be better phrased and improved overall.

## How to contribute

1. Fork the repository and clone it to your local machine.
2. Create a new branch with a descriptive name: git checkout -b your-branch-name
3. Make your changes to the README file. Please ensure that your changes are relevant and add value to the project.
4. Test your changes locally to ensure that they do not break anything.
5. Commit your changes with a descriptive commit message: git commit -m "Add descriptive commit message here"
6. Push your changes to your forked repository: git push origin your-branch-name
7. Open a pull request to the main repository and describe your changes in the PR description.

## Storing environment variables in .env file

Create a .env file in the root directory of the project. This .env file will require the following url's and API keys.

'''
DATABASE_URL = [url]
REDIS_URL = [url]
SENDGRID_API_KEY = [API key]
OPENAI_API_KEY = [API key]
STRIPE_API_SECRET_KEY = [API key]
'''
