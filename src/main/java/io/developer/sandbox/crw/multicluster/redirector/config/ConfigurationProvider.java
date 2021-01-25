package io.developer.sandbox.crw.multicluster.redirector.config;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.eclipse.microprofile.config.inject.ConfigProperty;

@Path("/config")
public class ConfigurationProvider {

    @ConfigProperty(name = "developer.sandbox.registration-service.url")
    private String registrationServiceURL;

    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public Response getURL() {
        return Response.ok(registrationServiceURL, MediaType.TEXT_PLAIN).build();
    }

}
