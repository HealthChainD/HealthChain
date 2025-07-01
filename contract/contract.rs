use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkgMQHGt1hLkJ");

#[program]
pub mod health_profile {
    use super::*;

    pub fn initialize_profile(ctx: Context<InitializeProfile>, role: u8) -> Result<()> {
        let profile = &mut ctx.accounts.profile;
        profile.owner = *ctx.accounts.user.key;
        profile.role = role;
        profile.documents = Vec::new();
        Ok(())
    }

    pub fn add_document(ctx: Context<UpdateProfile>, ipfs_cid: String) -> Result<()> {
        let profile = &mut ctx.accounts.profile;
        require!(
            profile.owner == *ctx.accounts.user.key,
            CustomError::Unauthorized
        );
        profile.documents.push(ipfs_cid);
        Ok(())
    }

    pub fn remove_document(ctx: Context<UpdateProfile>, index: u32) -> Result<()> {
        let profile = &mut ctx.accounts.profile;
        require!(
            profile.owner == *ctx.accounts.user.key,
            CustomError::Unauthorized
        );
        let idx = index as usize;
        if idx < profile.documents.len() {
            profile.documents.remove(idx);
            Ok(())
        } else {
            err!(CustomError::IndexOutOfBounds)
        }
    }

    pub fn update_role(ctx: Context<UpdateProfile>, new_role: u8) -> Result<()> {
        let profile = &mut ctx.accounts.profile;
        require!(
            profile.owner == *ctx.accounts.user.key,
            CustomError::Unauthorized
        );
        profile.role = new_role;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeProfile<'info> {
    #[account(init, payer = user, space = Profile::LEN)]
    pub profile: Account<'info, Profile>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateProfile<'info> {
    #[account(mut, has_one = owner)]
    pub profile: Account<'info, Profile>,
    pub owner: Signer<'info>,
    #[account(address = profile.owner)]
    
    pub user: AccountInfo<'info>,
}

#[account]
pub struct Profile {
    pub owner: Pubkey,
    pub role: u8, 
    pub documents: Vec<String>, 
}

impl Profile {    
    pub const MAX_DOCS: usize = 10;
    pub const MAX_CID_LEN: usize = 64;
    pub const LEN: usize = 8 + 32 + 1 + 4 + (Self::MAX_DOCS * (4 + Self::MAX_CID_LEN));
}

#[error_code]
pub enum CustomError {
    #[msg("You are not authorized to perform this action.")]
    Unauthorized,
    #[msg("Index out of bounds.")]
    IndexOutOfBounds,
}