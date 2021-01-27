package io.developer.sandbox.crw.multicluster.redirector.config;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.is;

import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.junit.jupiter.api.Test;

import io.quarkus.test.junit.QuarkusTest;

@QuarkusTest
public class ConfigurationProviderTest {

    @ConfigProperty(name = "developer.sandbox.registration-service.url")
    private String registrationServiceURL;

    @Test
    public void testConfigurationEndpoint() {
        given()
        .when().get("/config")
        .then()
           .statusCode(200)
           .body(is(registrationServiceURL));
    }

}
