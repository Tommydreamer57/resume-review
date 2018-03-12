const organisation = {
    id: -1,
    name: "default organisation",
    description: "default organisation description",
    img: "organisation image",
    members: [-1]
}

const individual = {
    id: -1,
    name: "Tommy",
    email: "mini@lao.com",
    img: "tommy image",
    memberships: [-1],
    resume: {
        pdf: "anjbeiwgjosdvmkdjnfh",
        company: "DevMountain",
        version: -1,
        comments: [
            {
                author_id: -1,
                body: "Great job",
                timestamp: new Date()
            }
        ]
    },
    previousResumes: [
        {
            pdf: "warestrngfbvdsewgrabdfv",
            company: "DevMountain",
            version: -1,
            comments: []
        }
    ]
}

export default {
    organisation,
    individual
}
