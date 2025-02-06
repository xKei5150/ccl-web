import sharp from 'sharp'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { buildConfig } from 'payload'
import PersonalInformation from './collections/PersonalInformation'
import ProfilePhoto from './collections/ProfilePhoto'
import Business from './collections/Business'
import SupportingDocuments from './collections/SupportingDocuments'
import BusinessPermits from './collections/BusinessPermits'
import Requests from './collections/Requests'
import Households from './collections/Households'
import Reports from './collections/Reports'
import ThemeSettings from './globals/ThemeSettings'

export default buildConfig({
  // If you'd like to use Rich Text, pass your editor here
  editor: lexicalEditor(),

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
  ],
  globals: [
    ThemeSettings,
  ],

  // Your Payload secret - should be a complex and secure string, unguessable
  secret: process.env.PAYLOAD_SECRET || '',
  // Whichever Database Adapter you're using should go here
  // Mongoose is shown as an example, but you can also use Postgres
  db: mongooseAdapter({
    url: process.env.DB_URI || '',
  }),
  // If you want to resize images, crop, set focal point, etc.
  // make sure to install it and pass it to the config.
  // This is optional - if you don't need to do these things,
  // you don't need it!
  sharp,
})