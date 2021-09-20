-- Create consumer mappings
-- Set the mappings array ("type_consumer_conclave_mapping[]") with consumer attribute name and conclave attribute id
-- Configured for Digits user scenario
CREATE TYPE type_consumer_conclave_mapping  AS (
        consumerAttributeName text,
        conclaveAttributeId int
    );
	
CREATE OR REPLACE FUNCTION create_consumer_mappings() RETURNS integer AS $$
	
	DECLARE consumerName text = 'CONSUMER_NAME';
	DECLARE consumerClientId text = 'CLIENT_ID';
	DECLARE consumerId int;
	DECLARE consumerEntityName text = 'User'; -- Organisation, User, Contact, OrgContact, UserContact, SiteContact
	DECLARE consumerEntityId int;
  DECLARE attributeMapping type_consumer_conclave_mapping;
  DECLARE consumerEntityAttributeId int;

  DECLARE mappings type_consumer_conclave_mapping[] = array[('userName', 22), ('organisationId', 23), ('firstName', 24), ('lastName', 25), ('title', 26 ), ('userDetailId', 28), ('identityProviderId', 29), ('identityProviderDisplayName', 30), ('rolePermissionInfo', 32), ('additionalRoles', 39), ('organisationIdentifier', 85), ('organisationAdditionalIdentifiers', 86), ('organisationAddress', 7),  ('organisationDetail', 13), ('userContactPoints', 60)];

   BEGIN
	
	  IF NOT EXISTS (SELECT "Id" FROM public."AdapterConsumer" WHERE "Name" = consumerName and "ClientId" = consumerClientId LIMIT 1) THEN
      INSERT INTO public."AdapterConsumer"(
	    "Id", "Name", "CreatedOnUtc", "LastUpdatedOnUtc", "IsDeleted", "ClientId")
	    VALUES ( DEFAULT, consumerName,  now(), now(), false, consumerClientId);
   	END IF;

	  SELECT "Id" into consumerId FROM public."AdapterConsumer" WHERE "Name" = consumerName and "ClientId" = consumerClientId LIMIT 1;

    DELETE FROM public."AdapterConsumerEntity" WHERE "Name" = consumerEntityName and "AdapterConsumerId" = consumerId;

    INSERT INTO public."AdapterConsumerEntity"(
	    "Id", "Name", "AdapterConsumerId", "CreatedOnUtc", "LastUpdatedOnUtc", "IsDeleted")
	    VALUES ( DEFAULT, consumerEntityName, consumerId, now(), now(), false);

	  SELECT "Id" into consumerEntityId FROM public."AdapterConsumerEntity" WHERE "Name" = consumerEntityName and "AdapterConsumerId" = consumerId LIMIT 1;

     FOREACH attributeMapping IN ARRAY mappings
     LOOP
        INSERT INTO public."AdapterConsumerEntityAttribute"(
	        "Id", "AttributeName", "AdapterConsumerEntityId", "CreatedOnUtc", "LastUpdatedOnUtc", "IsDeleted")
	        VALUES ( DEFAULT, attributeMapping.consumerAttributeName, consumerEntityId, now(), now(), false);

        SELECT "Id" into consumerEntityAttributeId FROM public."AdapterConsumerEntityAttribute" WHERE "AttributeName" = attributeMapping.consumerAttributeName and "AdapterConsumerEntityId" = consumerEntityId LIMIT 1;

        INSERT INTO public."AdapterConclaveAttributeMapping"(
	      "Id", "AdapterConsumerEntityAttributeId", "ConclaveEntityAttributeId", "CreatedOnUtc", "LastUpdatedOnUtc", "IsDeleted")
	      VALUES ( DEFAULT, consumerEntityAttributeId, attributeMapping.conclaveAttributeId, now(), now(), false);

     END LOOP;
		
		RETURN 1;
	END;
$$ LANGUAGE plpgsql;

-- Set the primary key sequence value since the records have been changed using pgadmin
-- https://stackoverflow.com/questions/18389537/does-postgresql-serial-work-differently/18389891#18389891
-- https://stackoverflow.com/questions/44708548/postgres-complains-id-already-exists-after-insert-of-initial-data/44708862
SELECT setval('"AdapterConsumer_Id_seq"', max("Id")) FROM "AdapterConsumer";
SELECT setval('"AdapterConsumerEntity_Id_seq"', max("Id")) FROM "AdapterConsumerEntity";
SELECT setval('"AdapterConsumerEntityAttribute_Id_seq"', max("Id")) FROM "AdapterConsumerEntityAttribute";
SELECT setval('"AdapterConclaveAttributeMapping_Id_seq"', max("Id")) FROM "AdapterConclaveAttributeMapping";
SELECT create_consumer_mappings();

DROP FUNCTION create_consumer_mappings;

DROP TYPE IF EXISTS type_consumer_conclave_mapping;
