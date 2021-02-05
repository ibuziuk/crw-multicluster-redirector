/*
 * Copyright (c) 2021 Red Hat, Inc.
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Contributors:
 *   Red Hat, Inc. - initial API and implementation
 */
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
