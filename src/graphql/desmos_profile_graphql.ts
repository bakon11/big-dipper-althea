export const DesmosProfileDocument = /* GraphQL */`
query DesmosProfile($addressOrDtag: String) {
  profile(where: {_or: [
    {dtag: {_eq: $addressOrDtag}},
    {address: {_eq: $addressOrDtag}},
  ]}, limit: 1) {
    address
    bio
    dtag
    nickname
    creationTime: creation_time
    profilePic: profile_pic
    chainLinks: chain_links {
      creationTime: creation_time
      externalAddress: external_address
      chainConfigId: chain_config_id
    }
    applicationLinks: application_links (where: {state: {_eq: "APPLICATION_LINK_STATE_VERIFICATION_SUCCESS"}}){
      username
      creationTime: creation_time
      application
    }
  }
}
`;

// use this query if address is a link and not owner
export const DesmosProfileLinkDocument = /* GraphQL */`
query DesmosProfileLink($address: String) {
  profile (where: {chain_links: {external_address: {_eq: $address}}}){
    address
    bio
    dtag
    nickname
    creationTime: creation_time
    profilePic: profile_pic
    chainLinks: chain_links {
      creationTime: creation_time
      externalAddress: external_address
      chainConfigId: chain_config_id
    }
    applicationLinks: application_links (where: {state: {_eq: "APPLICATION_LINK_STATE_VERIFICATION_SUCCESS"}}){
      username
      creationTime: creation_time
      application
    }
  }
}
`;
