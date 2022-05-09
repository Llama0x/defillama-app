import { PageWrapper, FullWrapper } from 'components'
import Search from 'components/Search'
import { AutoColumn } from 'components/Column'
import Table, { columnsToShow } from 'components/Table'
import { formattedPercent } from 'utils'
import { CheckMarks } from 'components/SettingsModal'
import { CustomLink } from 'components/Link'
import styled from 'styled-components'
import { AutoRow, RowBetween, RowFlat } from 'components/Row'
import { TYPE } from 'Theme'
import Filters from 'components/Filters'
import { NameYield } from 'components/Table/index'
import {
  useNoILManager,
  useSingleExposureManager,
  useStablecoinsManager,
  useMillionDollarManager,
} from 'contexts/LocalStorage'
import QuestionHelper from 'components/QuestionHelper'

const ListOptions = styled(AutoRow)`
  height: 40px;
  width: 100%;
  font-size: 1.25rem;
  font-weight: 600;

  @media screen and (max-width: 640px) {
    font-size: 1rem;
  }
`

const FiltersRow = styled(RowFlat)`
  @media screen and (min-width: 800px) {
    width: calc(100% - 90px);
  }
`

const TableWrapper = styled(Table)`
  tr > * {
    & > div {
      width: 100px;
      white-space: nowrap;
      overflow: hidden;
    }
  }

  // POOL
  tr > *:nth-child(1) {
    & > a {
      width: 200px;
      overflow: hidden;
      white-space: nowrap;
      display: block;
    }
  }

  // PROJECT
  tr > *:nth-child(2) {
    display: none;
    text-align: start;

    & > div {
      width: 200px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  // CHAINS
  tr > *:nth-child(3) {
    display: none;
    text-align: start;
    & > * {
      justify-content: flex-start;
    }
  }

  // TVL
  tr > *:nth-child(4) {
    display: none;
  }

  // APY
  tr > *:nth-child(5) {
    padding-right: 20px;
  }

  // 1D CHANGE
  tr > *:nth-child(6) {
    display: none;
  }

  // 7D CHANGE
  tr > *:nth-child(7) {
    display: none;
  }

  // OUTLOOK
  tr > *:nth-child(8) {
    display: none;
  }

  // PROBABILITY
  tr > *:nth-child(9) {
    display: none;
  }

  // OUTLOOK
  tr > th:nth-child(8) {
    & > div {
      margin-left: auto;
    }
  }

  // PROBABILITY
  tr > th:nth-child(9) {
    & > div {
      margin-left: auto;
    }
  }

  @media screen and (min-width: ${({ theme }) => theme.bpSm}) {
    // APY
    tr > *:nth-child(5) {
      padding-right: 0px;
    }

    // OUTLOOK
    tr > *:nth-child(8) {
      display: revert;
      padding-right: 20px;
    }
  }

  @media screen and (min-width: ${({ theme }) => theme.bpMed}) {
    // OUTLOOK
    tr > *:nth-child(8) {
      padding-right: 0px;
    }

    // PROBABILITY
    tr > *:nth-child(9) {
      display: revert;
    }
  }

  @media screen and (min-width: ${({ theme }) => theme.bpLg}) {
    // TVL
    tr > *:nth-child(4) {
      display: revert;
    }
  }

  @media screen and (min-width: ${({ theme }) => theme.bpXl}) {
    // 7D CHANGE
    tr > *:nth-child(7) {
      display: revert;
    }

    // 1D CHANGE
    tr > *:nth-child(6) {
      display: revert;
    }
  }

  // PROJECT
  @media screen and (min-width: 1536px) {
    tr > *:nth-child(2) {
      display: revert;
    }
  }

  // CHAINS
  @media screen and (min-width: 1680px) {
    tr > *:nth-child(3) {
      display: revert;
    }
  }
`

const YieldPage = ({ pools, chainList }) => {
  // for /yields/project/[project] I don't want to use href on Project column
  const projectsUnique = [...new Set(pools.map((el) => el.project))]

  const columns = [
    {
      header: 'Pool',
      accessor: 'pool',
      disableSortBy: true,
      Cell: ({ value, rowValues }) => (
        <CustomLink href={`/yields/pool/${rowValues.id}`}>
          {rowValues.project === 'Osmosis' ? `${value} ${rowValues.id.split('-').slice(-1)}` : value}
        </CustomLink>
      ),
    },
    {
      header: 'Project',
      accessor: 'project',
      disableSortBy: true,
      Cell: ({ value, rowValues }) =>
        projectsUnique.length > 1 ? (
          <NameYield value={(value, rowValues)} />
        ) : (
          <NameYield value={(value, rowValues)} rowType={'accordion'} />
        ),
    },
    ...columnsToShow('chains', 'tvl'),
    {
      header: 'APY',
      accessor: 'apy',
      helperText: 'Annualised percentage yield',
      Cell: ({ value, rowValues }) => {
        return (
          <AutoRow sx={{ width: '100%', justifyContent: 'flex-end' }}>
            {rowValues.project === 'Osmosis' ? (
              <QuestionHelper text={`${rowValues.id.split('-').slice(-1)} lock`} />
            ) : null}
            {formattedPercent(value, true)}
          </AutoRow>
        )
      },
    },
    {
      header: '1d change',
      accessor: 'change1d',
      Cell: ({ value }) => <>{formattedPercent(value)}</>,
    },
    {
      header: '7d change',
      accessor: 'change7d',
      Cell: ({ value }) => <>{formattedPercent(value)}</>,
    },
    {
      header: 'Outlook',
      accessor: 'outlook',
      helperText:
        'The predicted outlook indicates if the current APY can be maintained (stable or up) or not (down) within the next 4weeks. The algorithm consideres APYs as stable with a fluctuation of up to -20% from the current APY.',
      Cell: ({ value }) => <>{value}</>,
    },
    {
      header: 'Probability',
      accessor: 'probability',
      helperText: 'Predicted probability of outlook',
      Cell: ({ value }) => <>{value === null ? null : value.toFixed(2) + '%'}</>,
    },
  ]

  const chain = [...new Set(pools.map((el) => el.chain))]
  const selectedTab = chain.length > 1 ? 'All' : chain[0]
  const tabOptions = [
    {
      label: 'All',
      to: '/yields',
    },
    ...chainList.map((el) => ({ label: el, to: `/yields/chain/${el}` })),
  ]

  // toggles
  const [stablecoins] = useStablecoinsManager()
  const [noIL] = useNoILManager()
  const [singleExposure] = useSingleExposureManager()
  const [millionDollar] = useMillionDollarManager()
  // apply toggles
  pools = stablecoins === true ? pools.filter((el) => el.stablecoin === true) : pools
  pools = noIL === true ? pools.filter((el) => el.ilRisk === 'no') : pools
  pools = singleExposure === true ? pools.filter((el) => el.exposure === 'single') : pools
  pools = millionDollar === true ? pools.filter((el) => el.tvlUsd >= 1e6) : pools

  return (
    <PageWrapper>
      <FullWrapper>
        <AutoColumn gap="24px">
          <Search />
        </AutoColumn>
        <CheckMarks type="yields" style={{ display: 'flex', justifyContent: 'center' }} />
        <ListOptions gap="10px" style={{ marginBottom: '.5rem' }}>
          <RowBetween>
            <TYPE.main fontSize={'1.125rem'}>Yield Rankings</TYPE.main>
            <FiltersRow>
              <Filters filterOptions={tabOptions} activeLabel={selectedTab} justify="end" />
            </FiltersRow>
          </RowBetween>
        </ListOptions>
        <TableWrapper
          data={pools.map((t) => ({
            id: t.pool,
            pool: t.symbol,
            projectslug: t.project,
            project: t.projectName,
            chains: [t.chain],
            tvl: t.tvlUsd,
            apy: t.apy,
            change1d: t.apyPct1D,
            change7d: t.apyPct7D,
            outlook: t.predictions.predictedClass,
            probability: t.predictions.predictedProbability,
          }))}
          columns={columns}
        />
      </FullWrapper>
    </PageWrapper>
  )
}

export default YieldPage