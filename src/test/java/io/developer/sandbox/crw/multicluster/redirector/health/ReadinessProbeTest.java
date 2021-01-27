package io.developer.sandbox.crw.multicluster.redirector.health;

import static io.restassured.RestAssured.given;

import org.junit.jupiter.api.Test;

import io.quarkus.test.junit.QuarkusTest;

@QuarkusTest
public class ReadinessProbeTest {

    @Test
    public void testReadinessProbeEndpoint() {
        given()
        .when().get("/health/ready")
        .then()
           .statusCode(200);
    }

}
