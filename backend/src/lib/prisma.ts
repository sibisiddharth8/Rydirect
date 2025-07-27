import { PrismaClient } from '@prisma/client';

const prismaClient = new PrismaClient();

const extendedPrismaClient = prismaClient.$extends({
  result: {
    link: {
      // Create a new computed field `iconUrl`
      iconUrl: {
        needs: { iconUrl: true }, // It needs the original iconUrl field
        compute(link) {
          // If the iconUrl exists and doesn't already start with http, prepend the backend URL.
          if (link.iconUrl && !link.iconUrl.startsWith('http')) {
            return `${process.env.BACKEND_URL}${link.iconUrl}`;
          }
          return link.iconUrl; // Otherwise, return it as is.
        },
      },
      // Do the same for all other image fields
      companyLogoUrl: {
        needs: { companyLogoUrl: true },
        compute(link) {
          if (link.companyLogoUrl && !link.companyLogoUrl.startsWith('http')) {
            return `${process.env.BACKEND_URL}${link.companyLogoUrl}`;
          }
          return link.companyLogoUrl;
        },
      },
      heroImageUrl: {
        needs: { heroImageUrl: true },
        compute(link) {
          if (link.heroImageUrl && !link.heroImageUrl.startsWith('http')) {
            return `${process.env.BACKEND_URL}${link.heroImageUrl}`;
          }
          return link.heroImageUrl;
        },
      },
    },
    user: {
      // And for the user's profile image
      profileImageUrl: {
        needs: { profileImageUrl: true },
        compute(user) {
          if (user.profileImageUrl && !user.profileImageUrl.startsWith('http')) {
            return `${process.env.BACKEND_URL}${user.profileImageUrl}`;
          }
          return user.profileImageUrl;
        },
      }
    }
  },
});

export default extendedPrismaClient;