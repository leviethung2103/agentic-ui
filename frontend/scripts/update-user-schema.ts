import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting user schema update...');
  
  try {
    // 1. Update existing users with null email
    const usersWithNullEmail = await prisma.$queryRaw`SELECT * FROM "User" WHERE "email" IS NULL` as any[];

    if (usersWithNullEmail.length > 0) {
      console.log(`Found ${usersWithNullEmail.length} users with null email`);
      
      for (const user of usersWithNullEmail) {
        const tempEmail = `user-${user.id}@example.com`;
        console.log(`Updating user ${user.id} with email: ${tempEmail}`);
        
        await prisma.user.update({
          where: { id: user.id },
          data: { 
            email: tempEmail,
            // Set a default password if it's null
            ...(user.password === null && { 
              password: await hash('changeme123', 10) 
            })
          },
        });
      }
    }

    // 2. Make email and password columns required in the database
    console.log('Updating database schema...');
    
    // This is a raw SQL approach since Prisma doesn't support altering column constraints directly
    await prisma.$executeRaw`
      DO $$
      BEGIN
        -- Make email not null
        EXECUTE 'ALTER TABLE "User" ALTER COLUMN "email" SET NOT NULL';
        
        -- Make password not null (assuming we've set default values above)
        EXECUTE 'ALTER TABLE "User" ALTER COLUMN "password" SET NOT NULL';
        
        -- Add updatedAt with default if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name = 'User' AND column_name = 'updatedAt') THEN
          EXECUTE 'ALTER TABLE "User" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP';
        END IF;
        
        -- Drop username column if it exists
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'User' AND column_name = 'username') THEN
          EXECUTE 'ALTER TABLE "User" DROP COLUMN "username"';
        END IF;
      END
      $$;
    `;

    console.log('Database schema updated successfully!');
  } catch (error) {
    console.error('Error updating user schema:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
