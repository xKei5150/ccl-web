import sharp from 'sharp'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { buildConfig } from 'payload'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import PersonalInformation from './collections/PersonalInformation'
import ProfilePhoto from './collections/ProfilePhoto'
import Business from './collections/Business'
import SupportingDocuments from './collections/SupportingDocuments'
import BusinessPermits from './collections/BusinessPermits'
import Requests from './collections/Requests'
import Households from './collections/Households'
import Reports from './collections/Reports'
import ThemeSettings from './globals/ThemeSettings'
import SiteSettings from './globals/SiteSettings'
import Media from './collections/Media'
import Users from './collections/Users'
import Posts from './collections/Posts'
import Financing from './collections/Financing'
import FinancingAuditLog from './collections/FinancingAuditLog'
import StorageFolders from './collections/StorageFolders'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import Projects from './collections/Projects'
import Demographics from './collections/Demographics'
export default buildConfig({
  serverURL: process.env.SERVER_URL,
  // If you'd like to use Rich Text, pass your editor here
  editor: lexicalEditor({}),

  // Define and configure your collections in this array
  collections: [
    PersonalInformation,
    ProfilePhoto,
    Business,
    SupportingDocuments,
    BusinessPermits,
    Requests,
    Households,
    Reports,
    Media,
    Users,
    Posts,
    Financing,
    FinancingAuditLog,
    StorageFolders,
    Projects,
    Demographics,
  ],

  globals: [
    ThemeSettings,
    SiteSettings,
  ],

  plugins: [
    vercelBlobStorage({
      enabled: true, // Optional, defaults to true
      // Specify which collections should use Vercel Blob
      collections: {
        'profile-photo': true,
        'supporting-documents': true,
        'media': true,
      },
      // Token provided by Vercel once Blob storage is added to your Vercel project
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  ],

  // Email configuration using the official nodemailer adapter
  email: nodemailerAdapter({
    defaultFromAddress: process.env.EMAIL_FROM_ADDRESS,
    defaultFromName: process.env.EMAIL_FROM_NAME,
    transportOptions: {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    },
  }),

  // Your Payload secret - should be a complex and secure string, unguessable
  secret: process.env.PAYLOAD_SECRET || '',
  // Whichever Database Adapter you're using should go here
  // Mongoose is shown as an example, but you can also use Postgres
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    }
  }),
  // If you want to resize images, crop, set focal point, etc.
  // make sure to install it and pass it to the config.
  // This is optional - if you don't need to do these things,
  // you don't need it!
  sharp,
})