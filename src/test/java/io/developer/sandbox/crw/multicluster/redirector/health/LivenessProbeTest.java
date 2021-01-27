package io.developer.sandbox.crw.multicluster.redirector.health;

import static io.restassured.RestAssured.given;

import org.junit.jupiter.api.Test;

import io.quarkus.test.junit.QuarkusTest;

@QuarkusTest
public class LivenessProbeTest {

    @Test
    public void testLivenessProbeEndpoint() {
        given()
        .when().get("/health/live")
        .then()
           .statusCode(200);
    }

}
