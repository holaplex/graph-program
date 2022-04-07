use anchor_lang::prelude::*;

#[deprecated(note = "Use ConnectionV2 instead")]
#[account]
#[derive(Default)]
pub struct Connection {
    pub from: Pubkey,
    pub to: Pubkey,
}

impl Connection {
    pub fn calculate_space() -> usize {
        8 +         // account discriminator
        32 +        // from
        32          // to
    }
}
