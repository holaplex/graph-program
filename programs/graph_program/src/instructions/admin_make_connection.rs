use crate::{constants::*, state::ConnectionV2};

use anchor_lang::prelude::*;

const ADMIN_PUBKEY: &str = "hoLa3t1FsYMyQJTiFnoJ8HWuvMhSVuR8jXtxRRsVrNp";

#[derive(Accounts)]
#[instruction(from: Pubkey, to: Pubkey)]
pub struct AdminMakeConnection<'info> {
    #[account(
        init,
        payer = signer,
        space = ConnectionV2::calculate_space(),
        seeds = [CONNECTION_SEED_V2.as_ref(), from.as_ref(), to.as_ref()],
        bump,
    )]
    pub connection: Account<'info, ConnectionV2>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn admin_make_connection(
    ctx: Context<AdminMakeConnection>,
    from: Pubkey,
    to: Pubkey,
) -> Result<()> {
    require!(
        ctx.accounts.signer.key().to_string() == String::from(ADMIN_PUBKEY),
        AdminMakeConnectionError::InvalidAdminAccount
    );
    let clock = Clock::get()?;
    let connection = &mut ctx.accounts.connection;
    connection.from = from;
    connection.to = to;
    connection.connected_at = clock.unix_timestamp;
    connection.disconnected_at = None;
    connection.log_make();
    Ok(())
}

#[error_code]
pub enum AdminMakeConnectionError {
    #[msg("Invalid Admin Account")]
    InvalidAdminAccount,
}
