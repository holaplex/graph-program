use anchor_lang::prelude::*;

#[account]
#[derive(Default)]
pub struct Connection {
    pub from: Pubkey,
    pub to: Pubkey,
}

impl Connection {
    pub fn log_make(&self) {
        msg!("Created connection from {} to {}", self.from, self.to);
    }
    pub fn log_revoke(&self) {
        msg!("Revoked connection from {} to {}", self.from, self.to);
    }
}
