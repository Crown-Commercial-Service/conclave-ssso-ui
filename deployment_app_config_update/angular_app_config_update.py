import argparse
import boto3
import botocore.exceptions
import logging
import os

logging.basicConfig(level=logging.INFO)


def parse_arguments():
    description = (
        "Arguments to update/configure the angular app config prior to a deployment"
    )
    parser = argparse.ArgumentParser(description=description)
    parser.add_argument(
        "--angular-app-github-repository-path",
        help="The path to the angular github repository (must be cloned in a path that's locally available to this script)",
        default="./",
        dest="angular_app_github_repository_path",
        required=False,
    )
    parser.add_argument(
      "--aws-account-id",
      help="The AWS Account ID for the environment in which the deployment is to occur",
      dest="aws_account_id",
      required=True,
    )
    parser.add_argument(
        "--environment-prefix",
        help="The prefix for the name of the environment that the PPG application will be deployed to",
        dest="environment_prefix",
        choices=["dev", "uat", "test", "nft", "pre", "prod"],
        required=True,
    )
    parser.add_argument(
        "--idam-client-id-parameter-path",
        help="The full path for the IDAM Client ID SSM Parameter",
        default="/conclave-sso/angular/JwtTokenValidationInfo/IdamClienId",
        dest="idam_client_id_parameter_path",
        required=False,
    )
    parser.add_argument(
        "--region-name",
        help="The region in which to deploy the PPG application (defaults to eu-west-2)",
        default="eu-west-2",
        dest="region_name",
        required=False,
    )
    parser.add_argument(
        "--rollbar-token-parameter-path",
        help="The full path for the Rollbar Token SSM Parameter",
        default="/conclave-sso/angular/RollBarLogger/Token",
        dest="rollbar_token_parameter_path",
        required=False,
    )
    return parser.parse_args()


def update_angular_app_config(
    angular_app_github_repository_path,
    dict_of_ssm_parameter_values,
    environment_name,
    idam_client_id_parameter_path,
    rollbar_token_parameter_path,
):
    src_environment_ts_filepath = f"{angular_app_github_repository_path}src/environments/environment-{environment_name}.ts"
    src_updated_ts_filepath = f"{angular_app_github_repository_path}src/environments/environment.ts"
    try:
        logging.info(
            f"Attempting to update angular app config at path: {src_environment_ts_filepath}"
        )
        with open(src_environment_ts_filepath) as read_file:
            src_ts_file_updated_idam_client_id = read_file.read().replace(
                "%IDAM%", dict_of_ssm_parameter_values[idam_client_id_parameter_path]
            )
            src_ts_file_updated_config = src_ts_file_updated_idam_client_id.replace(
                "%ROLLBAR%", dict_of_ssm_parameter_values[rollbar_token_parameter_path]
            )

        with open(src_environment_ts_filepath, "w") as write_file:
            write_file.write(src_ts_file_updated_config)
        logging.info(
            f"Angular app config updated at path: {src_environment_ts_filepath}"
        )
        logging.info(f"Renaming the file from {src_environment_ts_filepath} to {src_updated_ts_filepath}")
        os.rename(src_environment_ts_filepath, src_updated_ts_filepath)
    except Exception as e:
        logging.error(
            f"Failed to updated Angular app config at path: {src_ts_file_updated_config}: {e}"
        )
        exit(1)


def angular_app_config_update_handler():
    (
        angular_app_github_repository_path,
        aws_account_id,
        environment_prefix,
        idam_client_id_parameter_path,
        region_name,
        rollbar_token_parameter_path,
    ) = get_args()
    boto3_sts_client = create_sts_boto3_client()
    sts_assume_role_credentials = get_sts_assume_role_credentials(
      aws_account_id=aws_account_id,
      boto3_sts_client=boto3_sts_client
    )
    boto3_ssm_client = create_ssm_boto3_client(
      region_name=region_name,
      sts_assume_role_credentials=sts_assume_role_credentials
    )
    environment_name = get_environment_name(environment_prefix)
    dict_of_ssm_parameter_values = get_ssm_parameter_values(
        aws_account_id=aws_account_id,
        boto3_ssm_client=boto3_ssm_client,
        idam_client_id_parameter_path=idam_client_id_parameter_path,
        region_name=region_name,
        rollbar_token_parameter_path=rollbar_token_parameter_path,
    )
    update_angular_app_config(
        angular_app_github_repository_path=angular_app_github_repository_path,
        dict_of_ssm_parameter_values=dict_of_ssm_parameter_values,
        environment_name=environment_name,
        idam_client_id_parameter_path=idam_client_id_parameter_path,
        rollbar_token_parameter_path=rollbar_token_parameter_path,
    )


def create_ssm_boto3_client(region_name, sts_assume_role_credentials):
    logging.debug("Creating SSM Boto3 Client")
    try:
        ssm_client = boto3.client(
          "ssm",
          aws_access_key_id=sts_assume_role_credentials['AccessKeyId'],
          aws_secret_access_key=sts_assume_role_credentials['SecretAccessKey'],
          aws_session_token=sts_assume_role_credentials['SessionToken'],
          region_name=region_name)
        return ssm_client
    except botocore.exceptions.ClientError as e:
        logging.error(f"Unable to create SSM Client: {e}")
        exit(1)


def create_sts_boto3_client():
  logging.debug("Creating STS Boto3 Client")
  try:
    ssm_client = boto3.client("sts")
    return ssm_client
  except botocore.exceptions.ClientError as e:
    logging.error(f"Unable to create SSM Client: {e}")
    exit(1)


def get_args(args=parse_arguments()):
    angular_app_github_repository_path = args.angular_app_github_repository_path
    aws_account_id = args.aws_account_id
    environment_prefix = args.environment_prefix
    idam_client_id_parameter_path = args.idam_client_id_parameter_path
    region_name = args.region_name
    rollbar_token_parameter_path = args.rollbar_token_parameter_path
    return (
        angular_app_github_repository_path,
        aws_account_id,
        environment_prefix,
        idam_client_id_parameter_path,
        region_name,
        rollbar_token_parameter_path,
    )


def get_environment_name(environment_prefix):
    logging.debug(f"Obtaining environment name for: {environment_prefix}")
    match environment_prefix:
        case "dev":
            environment_name = "development"
        case "test":
            environment_name = "testing"
        case "nft":
            environment_name = "NFT"
        case "pre":
            environment_name = "pre-production"
        case "prod":
            environment_name = "production"
        case _:
            environment_name = environment_prefix

    logging.info(
        f"Full environment name for {environment_prefix} is: {environment_name}"
    )

    return environment_name


def get_ssm_parameter_value(aws_account_id, boto3_ssm_client, region_name, ssm_parameter_name):
    try:
        logging.info(
            f"Attempting to get SSM Parameter value for SSM Parameter Name: {ssm_parameter_name}"
        )
        ssm_parameter_data = boto3_ssm_client.get_parameter(
            Name=f"arn:aws:ssm:{region_name}:{aws_account_id}:parameter{ssm_parameter_name}", WithDecryption=True
        )
        ssm_parameter_value = ssm_parameter_data["Parameter"]["Value"]
        logging.info(
            f"Obtained SSM Parameter value for SSM Parameter Name: {ssm_parameter_name}"
        )
        return ssm_parameter_value
    except Exception as e:
        logging.error(
            f"Failed to get SSM Parameter value for SSM Parameter Name: {ssm_parameter_name}: {e}"
        )
        exit(1)


def get_ssm_parameter_values(
  aws_account_id, boto3_ssm_client, idam_client_id_parameter_path, region_name, rollbar_token_parameter_path
):
    list_of_ssm_parameter_names = [
        idam_client_id_parameter_path,
        rollbar_token_parameter_path,
    ]
    dict_of_ssm_parameter_values = {}
    for ssm_parameter_name in list_of_ssm_parameter_names:
        ssm_parameter_value = get_ssm_parameter_value(
            aws_account_id=aws_account_id, boto3_ssm_client=boto3_ssm_client, region_name=region_name, ssm_parameter_name=ssm_parameter_name
        )
        dict_of_ssm_parameter_values[ssm_parameter_name] = ssm_parameter_value

    return dict_of_ssm_parameter_values


def get_sts_assume_role_credentials(aws_account_id, boto3_sts_client):
    try:
        logging.info("Obtaining assume role credentials for retrieving SSM Parameters")
        sts_assume_role_response = boto3_sts_client.assume_role(
            RoleArn=f"arn:aws:iam::{aws_account_id}:role/cicd_angular_ssm_parameters_role",
            RoleSessionName='cicd_angular_ssm_parameters_assume_role'
        )
        sts_assume_role_credentials = sts_assume_role_response['Credentials']
        logging.info("Successfully obtained assume role credentials for retrieving SSM Parameters")
        return sts_assume_role_credentials
    except Exception as e:
        logging.error(f"Failed to obtain assume role credentials: {e}")
        exit(1)


angular_app_config_update_handler()
