---
layout: default
title: CAS - Hazelcast Ticket Registry
category: Ticketing
---

{% include variables.html %}

# Hazelcast Ticket Registry

Hazelcast Ticket Registry is a distributed ticket registry implementation
based on [Hazelcast distributed grid library](http://hazelcast.org/). The registry implementation is
cluster-aware and is able to auto-join a cluster of all the CAS nodes that expose this registry.
Hazelcast will use port auto-increment feature to assign a TCP port to each member of a cluster starting
from initially provided arbitrary port, which is typically `5701` by default.

Hazelcast will evenly distribute the ticket data among all the members of a cluster in a very
efficient manner. Also, by default, the data collection on each node is configured with 1 backup copy,
so that Hazelcast will use it to make strong data consistency guarantees i.e. the loss of data on
live nodes will not occur should any other *primary data owner* members die. The data will be
re-partitioned among the remaining live cluster members.

Support is enabled by the following module:

{% include_cached casmodule.html group="org.apereo.cas" module="cas-server-support-hazelcast-ticket-registry" %}

## Configuration

This module has a configuration strategy which by default auto-configures a hazelcast 
instance used by the ticket registry implementation to build and retrieve Hazelcast 
maps for its distributed tickets storage. Some aspects of hazelcast configuration in 
this auto-configuration mode are controlled by CAS properties.

{% include_cached {{ version }}/hazelcast-configuration.md configKey="cas.ticket.registry.hazelcast" %}

<div class="alert alert-warning"><strong>Session Monitoring</strong><p>Be aware that under 
very heavy load and given a very large collection of tickets 
over time, <a href="../monitoring/Configuring-Monitoring.html">sessionmonitoring capabilities</a> of 
CAS that report back ticket statistics based on the underlying Hazelcast ticket 
registry may end up timing out. This is due to the concern that Hazelcast attempts 
to run distributed queries across the entire network to collect, analyze and 
aggregate tickets which may be still active or in flux. If you do experience 
this behavior, it likely is preferable to turn off the session monitor.
</p></div>

For more information on the Hazelcast configuration options available,
refer to [the Hazelcast documentation](http://docs.hazelcast.org/docs/4.1.1/manual/html-single/index.html#hazelcast-configuration)

## AWS EC2 Auto Discovery

Hazelcast support in CAS may handle EC2 auto-discovery automatically. It is useful when 
you do not want to provide or you cannot provide the list of possible IP addresses for 
the members of the cluster. You optionally also have the ability to specify partitioning 
group that would be zone aware. When using the zone-aware configuration, backups are 
created in the other AZs. Each zone will be accepted as one partition group. Using the 
AWS Discovery capability requires that you turn off and disable multicast and TCP/IP 
config in the CAS settings, which should be done automatically by CAS at runtime.

Support is enabled by the following module:

{% include_cached casmodule.html group="org.apereo.cas" module="cas-server-support-hazelcast-discovery-aws" %}

{% include_cached casproperties.html properties="cas.ticket.registry.hazelcast.cluster.discovery.aws" %}

## Apache JClouds Auto Discovery

Hazelcast support in CAS may handle auto-discovery automatically 
via [Apache jclouds®](https://jclouds.apache.org/). It is useful when 
you do not want to provide or you cannot provide the list of possible 
IP addresses for the members of the cluster. Apache jclouds® is an open 
source multi-cloud toolkit for the Java platform that gives you the freedom 
to create applications that are portable across clouds while giving you full 
control to use cloud-specific features. To see the full list of supported 
cloud environments, [please see this link](https://jclouds.apache.org/reference/providers/#compute).

{% include_cached casmodule.html group="org.apereo.cas" module="cas-server-support-hazelcast-discovery-jclouds" %}

{% include_cached casproperties.html properties="cas.ticket.registry.hazelcast.cluster.discovery.jclouds" %}

## Microsoft Azure Auto Discovery

Hazelcast support in CAS may handle auto-discovery automatically via Microsoft 
Azure. The discovery strategy will provide all Hazelcast instances by returning 
VMs within your Azure resource group that are tagged with a specified value. You 
will need to setup [Azure Active Directory Service Principal credentials](https://azure.microsoft.com/en-us/documentation/articles/resource-group-create-service-principal-portal/) for 
your Azure Subscription for this plugin to work. With every Hazelcast Virtual Machine 
you deploy in your resource group, you need to ensure that each VM is tagged with the 
value of `clusterId` defined in the CAS Hazelcast configuration. The only requirement 
is that every VM can access each other either by private or public IP address.

{% include_cached casmodule.html group="org.apereo.cas" module="cas-server-support-hazelcast-discovery-azure" %}

{% include_cached casproperties.html properties="cas.ticket.registry.hazelcast.cluster.discovery.azure" %}

## Apache ZooKeeper Auto Discovery

This plugin provides a service-based discovery by using Apache Curator to 
communicate with your Zookeeper server. Support is enabled by the following module:

{% include_cached casmodule.html group="org.apereo.cas" module="cas-server-support-hazelcast-discovery-zookeeper" %}

{% include_cached casproperties.html properties="cas.ticket.registry.hazelcast.cluster.discovery.zookeeper" %}

## Kubernetes Auto Discovery

This hazelcast discovery plugin provides the possibility to lookup IP addresses of other members by resolving 
those requests against a [Kubernetes](http://kubernetes.io/) Service Discovery system. 

This module supports two different options of resolving against the discovery registry:

- A request to the REST API
- DNS Lookup against a given headless DNS service name

See [this link](https://github.com/hazelcast/hazelcast-kubernetes) for more info.

{% include_cached casmodule.html group="org.apereo.cas" module="cas-server-support-hazelcast-discovery-kubernetes" %}

{% include_cached casproperties.html properties="cas.ticket.registry.hazelcast.cluster.discovery.kubernetes" %}

## Docker Swarm Auto Discovery

This hazelcast discovery plugin provides a Docker Swarm mode based discovery strategy. 

See [this link](https://github.com/bitsofinfo/hazelcast-docker-swarm-discovery-spi/) for more info.

{% include_cached casmodule.html group="org.apereo.cas" module="cas-server-support-hazelcast-discovery-swarm" %}

{% include_cached casproperties.html properties="cas.ticket.registry.hazelcast.cluster.discovery.docker-swarm" %}

## Multicast Auto Discovery

With the multicast auto-discovery mechanism, Hazelcast allows cluster members to find 
each other using multicast communication. The cluster members do not need to know the 
concrete addresses of the other members, as they just multicast to all the other 
members for listening. Whether multicast is possible or allowed **depends on your environment**.

Pay special attention to timeouts when multicast is enabled. Multicast timeout specifies 
the time in seconds that a member should wait for a valid multicast response from another 
member running in the network before declaring itself the leader 
member (the first member joined to the cluster) and creating its own cluster. This 
only applies to the startup of members where no leader has been assigned yet. If 
you specify a high value such as 60 seconds, it means that until a leader is selected 
each member will wait 60 seconds before moving on. Be careful when providing a high 
value. Also, be careful not to set the value too low, or the members might give 
up too early and create their own cluster.

{% include_cached casproperties.html properties="cas.ticket.registry.hazelcast.cluster.discovery.multicast." %}

## WAN Replication

Hazelcast WAN Replication allows you to keep multiple Hazelcast clusters 
in sync by replicating their state over WAN environments such as the Internet.

<div class="alert alert-warning"><strong>Usage Warning!</strong><p>Using Hazelcast 
WAN Replication requires a Hazelcast Enterprise subscription. Make sure you 
have acquired the proper license, SDK and tooling from Hazelcast before 
activating this feature. Please contact Hazelcast for more information.</p></div>

Hazelcast supports two different operation modes of WAN Replication:

- Active-Passive: This mode is mostly used for failover scenarios where you want to replicate an active cluster to one or more passive clusters, for the purpose of maintaining a backup.
- Active-Active: Every cluster is equal, each cluster replicates to all other clusters. This is normally used to connect different clients to different clusters for the sake of the shortest path between client and server.

See [this page](https://hazelcast.com/products/wan-replication/) for more information.

Defining WAN replication endpoints in CAS is done using static endpoints and discovery.

{% include_cached casproperties.html properties="cas.ticket.registry.hazelcast.cluster.wan-replication" %}

## Logging

To enable additional logging for the registry, configure the log4j configuration file to add the following
levels:

```xml
...
<Logger name="com.hazelcast" level="debug" additivity="false">
    <AppenderRef ref="console"/>
    <AppenderRef ref="file"/>
</Logger>
...
```
