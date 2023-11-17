# all script will start from base.sh
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# define function 'cds'
cds() {
  cd "$SCRIPT_DIR/.."
}

# export function cds
export -f cds


