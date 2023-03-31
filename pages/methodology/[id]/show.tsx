"use client"

import { FileSearchOutlined } from "@ant-design/icons"
import type { Credit, Methodology } from "@cap/sdk/graph"
import { CreditList } from "@components/credits/list"
import { Show } from "@components/resources/show"
import * as ipfs from "@lib/ipfs"
import { useTable } from "@refinedev/antd"
import { HttpError, useShow } from "@refinedev/core"
import { Button, Col, Row, Statistic, Typography } from "antd"
import type { NextPage } from "next"

export { getStaticProps, getStaticPaths } from "@lib/i18nSSG"

const MethodologyShowPage: NextPage = () => {
  const {
    queryResult: { data },
  } = useShow<Methodology>({
    meta: {
      fields: ["id", "uri", { owner: ["id"] }],
    },
  })

  const { tableProps, sorters } = useTable<Credit, HttpError>({
    resource: "credits",
    meta: {
      fields: [
        "id",
        "value",
        "uri",
        "validFrom",
        "validTo",
        "createdAt",
        "updatedAt",
        { claim: ["id", { regenerator: ["id"] }] },
      ],
    },
    pagination: {
      pageSize: 12,
    },
    sorters: {
      initial: [{ field: "updatedAt", order: "desc" }],
    },
    queryOptions: {
      refetchInterval: 10 * 1000,
    },
  })

  const record = data?.data

  return (
    <Show isLoading={!record} title={record?.name}>
      {record && (
        <>
          <Row gutter={16}>
            <Col span={5}>
              <Statistic
                title="Documents"
                valueRender={() => (
                  <Button
                    type="primary"
                    icon={<FileSearchOutlined />}
                    href={record.uri ? ipfs.viewURL(record.uri) : "#"}
                    target="_blank"
                  >
                    View Documents
                  </Button>
                )}
              />
            </Col>
            <Col span={5}>
              <Statistic title="Owner" value={record.owner.id} />
            </Col>
          </Row>
          <Typography.Title
            level={2}
            style={{ marginTop: 48, marginBottom: 32 }}
          >
            Credits
          </Typography.Title>
          <CreditList tableProps={tableProps} sorters={sorters} />
        </>
      )}
    </Show>
  )
}

export default MethodologyShowPage
