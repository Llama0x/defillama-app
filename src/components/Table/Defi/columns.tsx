import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpRight, ChevronDown, ChevronRight } from 'react-feather'
import { CustomLink } from '~/components/Link'
import TokenLogo from '~/components/TokenLogo'
import { ButtonYields } from '~/layout/Pool'
import { capitalizeFirstLetter, chainIconUrl, formattedNum, formattedPercent } from '~/utils'
import { AccordionButton, Name } from '../shared'
import { formatColumnOrder } from '../utils'
import { listedAtColumn } from './Protocols/columns'
import type { ICategoryRow, IChainsRow, IForksRow, IOraclesRow } from './types'

export const oraclesColumn: ColumnDef<IOraclesRow>[] = [
	{
		header: 'Name',
		accessorKey: 'name',
		enableSorting: false,
		cell: ({ getValue, row, table }) => {
			const index = row.depth === 0 ? table.getSortedRowModel().rows.findIndex((x) => x.id === row.id) : row.index

			return (
				<Name>
					<span>{index + 1}</span> <CustomLink href={`/oracles/${getValue()}`}>{getValue()}</CustomLink>
				</Name>
			)
		}
	},
	{
		header: 'Protocols Secured',
		accessorKey: 'protocolsSecured',
		meta: {
			align: 'end'
		}
	},
	{
		header: 'TVS',
		accessorKey: 'tvs',
		cell: ({ getValue }) => <>{'$' + formattedNum(getValue())}</>,
		meta: {
			align: 'end',
			headerHelperText: 'Excludes CeFi'
		}
	}
]

export const forksColumn: ColumnDef<IForksRow>[] = [
	{
		header: 'Name',
		accessorKey: 'name',
		enableSorting: false,
		cell: ({ getValue, row, table }) => {
			const index = row.depth === 0 ? table.getSortedRowModel().rows.findIndex((x) => x.id === row.id) : row.index

			return (
				<Name>
					<span>{index + 1}</span> <CustomLink href={`/forks/${getValue()}`}>{getValue()}</CustomLink>
				</Name>
			)
		}
	},
	{
		header: 'Forked Protocols',
		accessorKey: 'forkedProtocols',
		meta: {
			align: 'end'
		}
	},
	{
		header: 'TVL',
		accessorKey: 'tvl',
		cell: ({ getValue }) => <>{'$' + formattedNum(getValue())}</>,
		meta: {
			align: 'end'
		}
	},
	{
		header: 'Forks TVL / Original TVL',
		accessorKey: 'ftot',
		cell: ({ getValue }) => {
			const value = getValue() as number
			return <>{value && value.toFixed(2) + '%'}</>
		},
		meta: {
			align: 'end'
		}
	}
]

export const categoriesColumn: ColumnDef<ICategoryRow>[] = [
	{
		header: 'Category',
		accessorKey: 'name',
		enableSorting: false,
		cell: ({ getValue, row, table }) => {
			const index = row.depth === 0 ? table.getSortedRowModel().rows.findIndex((x) => x.id === row.id) : row.index

			return (
				<Name>
					<span>{index + 1}</span> <CustomLink href={`/protocols/${getValue()}`}>{getValue()}</CustomLink>
				</Name>
			)
		},
		size: 200
	},
	{
		header: 'Protocols',
		accessorKey: 'protocols',
		size: 140
	},
	{
		header: 'Combined TVL',
		accessorKey: 'tvl',
		cell: ({ getValue }) => <>{'$' + formattedNum(getValue())}</>,
		size: 140
	},
	{
		header: 'Description',
		accessorKey: 'description',
		enableSorting: false,
		size: 902
	}
]

const formatRaise = (n)=>{
	if(n>1e3){
		return `${n/1e3}b`
	}
	return `${n}m`
}
export const raisesColumns: ColumnDef<ICategoryRow>[] = [
	{
		...listedAtColumn,
		header: 'Date',
		accessorKey: 'date',
	},
	{
		header: 'Name',
		accessorKey: 'name',
		enableSorting: false,
		cell: ({ getValue }) => {
			return (
				<Name>
					{getValue()}
				</Name>
			)
		},
		size: 200
	},
	{
		header: 'Amount raised',
		accessorKey: 'amount',
		cell: ({ getValue }) => <>{'$' + formatRaise(getValue())}</>,
		size: 140
	},
	...["round", "sector", "lead"].map(s=>(
		{
			header: s==="lead"? "Lead Investor":capitalizeFirstLetter(s),
			accessorKey: s,
			enableSorting: false,
			size: 140
		}
	)),
	{
		header: 'Source',
		accessorKey: 'source',
		size: 45,
		enableSorting: false,
		cell: ({ getValue }) => 
			(<ButtonYields as="a" href={getValue() as string} target="_blank" rel="noopener noreferrer" data-lgonly useTextColor={true}>
				<ArrowUpRight size={14} />
			</ButtonYields>),
	},
	{
		header: 'Valuation',
		accessorKey: 'valuation',
		cell: ({ getValue }) => <>{ getValue()?'$' + formatRaise(getValue()):''}</>,
		size: 140
	},
]

export const chainsColumn: ColumnDef<IChainsRow>[] = [
	{
		header: () => <Name>Name</Name>,
		accessorKey: 'name',
		enableSorting: false,
		cell: ({ getValue, row, table }) => {
			const index = row.depth === 0 ? table.getSortedRowModel().rows.findIndex((x) => x.id === row.id) : row.index

			return (
				<Name depth={row.depth}>
					{row.subRows?.length > 0 && (
						<AccordionButton
							{...{
								onClick: row.getToggleExpandedHandler()
							}}
						>
							{row.getIsExpanded() ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
						</AccordionButton>
					)}
					<span>{index + 1}</span>
					<TokenLogo logo={chainIconUrl(getValue())} />
					<CustomLink href={`/chain/${getValue()}`}>{getValue()}</CustomLink>
				</Name>
			)
		},
		size: 200
	},
	{
		header: 'Protocols',
		accessorKey: 'protocols',
		size: 120,
		meta: {
			align: 'end'
		}
	},
	{
		header: '1d Change',
		accessorKey: 'change_1d',
		cell: (info) => <>{formattedPercent(info.getValue(), false, 400)}</>,
		size: 140,
		meta: {
			align: 'end'
		}
	},
	{
		header: '7d Change',
		accessorKey: 'change_7d',
		cell: (info) => <>{formattedPercent(info.getValue(), false, 400)}</>,
		size: 140,
		meta: {
			align: 'end'
		}
	},
	{
		header: '1m Change',
		accessorKey: 'change_1m',
		cell: (info) => <>{formattedPercent(info.getValue(), false, 400)}</>,
		size: 140,
		meta: {
			align: 'end'
		}
	},
	{
		header: 'TVL',
		accessorKey: 'tvl',
		cell: (info) => {
			return <>{'$' + formattedNum(info.getValue())}</>
		},
		size: 120,
		meta: {
			align: 'end'
		}
	},
	{
		header: 'Mcap/TVL',
		accessorKey: 'mcaptvl',
		cell: (info) => {
			return <>{info.getValue() && formattedNum(info.getValue())}</>
		},
		size: 120,
		meta: {
			align: 'end'
		}
	}
]

// key: min width of window/screen
// values: table columns order
export const chainsTableColumnOrders = formatColumnOrder({
	0: ['name', 'tvl', 'change_7d', 'protocols', 'change_1d', 'change_1m', 'mcaptvl'],
	400: ['name', 'change_7d', 'tvl', 'protocols', 'change_1d', 'change_1m', 'mcaptvl'],
	600: ['name', 'protocols', 'change_7d', 'tvl', 'change_1d', 'change_1m', 'mcaptvl'],
	900: ['name', 'protocols', 'change_1d', 'change_7d', 'change_1m', 'tvl', 'mcaptvl']
})
