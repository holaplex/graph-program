use anchor_lang::{prelude::*};

#[account]
pub struct ConnectionV2 {
    pub from: Pubkey,
    pub to: Pubkey,
    pub connected_at: i64,
    pub disconnected_at: Option<i64>,
}

impl ConnectionV2 {
    pub fn calculate_space() -> usize {
        8 +         // account discriminator
        32 +        // from
        32 +        // to
        8 +         // connected_at
        1 + 8       // disconnected_at
    }
    pub fn log_make(&self) {
        msg!("Connected from {} to {}", self.from, self.to);
    }
    pub fn log_revoke(&self) {
        msg!("Disconnected from {} to {}", self.from, self.to);
    }
    pub fn log_close(&self) {
        msg!("Closed from {} to {}", self.from, self.to);
    }
}
