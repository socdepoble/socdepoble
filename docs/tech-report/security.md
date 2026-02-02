# Security & Identity: Sovereign Protection 🛡️

In Sóc de Poble, security is not about passwords; it is about **verifiable local trust**.

## 1. Self-Sovereign Identity (SSI)
We eliminate dependency on big-tech identity providers (Google/Facebook/Apple). Each neighbor is the master of their own **Decentralized Identifier (DID)** [Source 106].
- **DID Methods**: Focused on peer-to-peer resolution without central registries.
- **Verifiable Credentials (VCs)**: Neighborhood associations can issue credentials to members to verify residency or roles without revealing private data.

## 2. Resilient Mesh Propagation (Plumtree)
Rural connectivity is often unstable. We implement the **Plumtree** protocol (Epidemic Broadcast Trees) [Source 99] to propagate messages through the village mesh.
- Even if the fiber to the outside world is cut, the village remains connected.
- Data spreads like a "digital rumors" algorithm, ensuring eventually consistent states across all neighbor nodes.

## 3. Secure Group Messaging (MLS)
For city council assemblies and private neighborhood groups, we utilize **Messaging Layer Security (MLS)** (RFC 9420) [Source 85].
- **Scalability**: MLS allows for secure end-to-end encryption in groups of thousands without the performance hit of traditional pairwise encryption.
- **Perfect Forward Secrecy**: Membership changes trigger automatic key rotations, ensuring that past and future messages remain protected even if a single node is compromised.

---
*Status: [BETA] Protocol Implementation*
